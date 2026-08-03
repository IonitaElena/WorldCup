import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Match } from '../../../models/match';

declare const bracketsViewer: any;

@Component({
  selector: 'app-bracket',
  standalone: true,
  templateUrl: './bracket.component.html',
  styleUrl: './bracket.component.css',
})
export class BracketComponent implements AfterViewInit, OnChanges {
  @Input()
  matches: Match[] = [];

  initialized = false;

  ngAfterViewInit() {
    this.initialized = true;
    this.renderBracket();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['matches'] && this.initialized) {
      this.renderBracket();
    }
  }

  renderBracket() {
    if (!this.matches || this.matches.length === 0) {
      return;
    }

    const data = this.convertToBracket();

    // console.log('BRACKET DATA', data);

    // console.log(
    //   data.matches.map((m: any) => ({
    //     id: m.id,
    //     round: m.round_id,
    //     number: m.number,
    //     home: m.opponent1?.id,
    //     away: m.opponent2?.id,
    //   })),
    // );
    // console.log('ROUNDS', data.rounds);

    // console.log(
    //   'ROUND COUNTS',
    //   data.rounds.map((r: any) => ({
    //     id: r.id,
    //     number: r.number,
    //     matches: data.matches.filter((m: any) => m.round_id === r.id).length,
    //   })),
    // );

    bracketsViewer.render(
      {
        stages: data.stages,
        groups: data.groups,
        rounds: data.rounds,
        matches: data.matches,
        participants: data.participants,
        matchGames: data.matchGames,
      },

      {
        selector: '#bracket',
        clear: true,
      },
    );
    setTimeout(() => {
      const participants = document.querySelectorAll('.brackets-viewer .participant');

      participants.forEach((el: any) => {
        const name = el.innerText.replace(/#\d+/g, '').trim();

        const country = data.participants.find((p: any) => name.includes(p.name));

        if (country?.flag) {
          const flag = document.createElement('span');

          flag.className = `fi fi-${country.flag}`;

          flag.style.marginRight = '6px';

          el.prepend(flag);
        }
      });
    }, 300);
  }

  convertToBracket() {
    const participants: any[] = [];
    const participantMap = new Map<string, number>();

    let participantId = 1;

    const countryFlags: any = {
      'South Africa': 'za',
      Canada: 'ca',
      Germany: 'de',
      Paraguay: 'py',
      Netherlands: 'nl',
      Morocco: 'ma',
      Brazil: 'br',
      Japan: 'jp',
      France: 'fr',
      Sweden: 'se',
      'Ivory Coast': 'ci',
      Norway: 'no',
      Mexico: 'mx',
      Ecuador: 'ec',
      England: 'gb-eng',
      'Democratic Republic of the Congo': 'cd',
      'United States': 'us',
      'Bosnia and Herzegovina': 'ba',
      Belgium: 'be',
      Senegal: 'sn',
      Portugal: 'pt',
      Croatia: 'hr',
      Spain: 'es',
      Austria: 'at',
      Switzerland: 'ch',
      Algeria: 'dz',
      Argentina: 'ar',
      'Cape Verde': 'cv',
      Colombia: 'co',
      Ghana: 'gh',
      Australia: 'au',
      Egypt: 'eg',
    };

    const getParticipant = (name: string | null) => {
      if (!name) return null;

      if (!participantMap.has(name)) {
        participantMap.set(name, participantId);

        participants.push({
          id: participantId,
          tournament_id: 1,
          name,
          flag: countryFlags[name] ?? 'un',
        });

        participantId++;
      }

      return participantMap.get(name);
    };
    const sorted = [...this.matches]
      .filter((m) => m.type !== 'third')
      .sort((a, b) => Number(a.matchday) - Number(b.matchday));

    const matches: any[] = [];

    let matchId = 1;
    console.log('R32 COUNT', this.matches.filter((x) => x.type === 'r32').length);

    // console.table(
    //   this.matches
    //     .filter((x) => x.type === 'r32')
    //     .map((x) => ({
    //       id: x.id,
    //       home: x.home_team_name_en,
    //       away: x.away_team_name_en,
    //     })),
    // );

    const createMatch = (source: any, round: number, number: number) => {
      let home: any;
      let away: any;

      if (source) {
        home = {
          id: getParticipant(source.home_team_name_en),
          position: 1,
          score: Number(source.home_score),
        };

        away = {
          id: getParticipant(source.away_team_name_en),
          position: 2,
          score: Number(source.away_score),
        };
      } else {
        home = {
          id: null,
          position: 1,
        };

        away = {
          id: null,
          position: 2,
        };
      }

      matches.push({
        id: matchId++,
        number,
        stage_id: 1,
        group_id: 1,
        round_id: round,
        child_count: 0,
        status: source?.finished === true || source?.finished === 'TRUE' ? 4 : 1,
        opponent1: home,
        opponent2: away,
      });
    };

    const r32 = sorted.filter((x) => x.type === 'r32');
    const r16 = sorted.filter((x) => x.type === 'r16');
    const qf = sorted.filter((x) => x.type === 'qf');
    const sf = sorted.filter((x) => x.type === 'sf');
    const final = sorted.find((x) => x.type === 'final');

    for (let i = 0; i < 16; i++) {
      createMatch(r32[i], 1, i + 1);
    }

    for (let i = 0; i < 8; i++) {
      createMatch(r16[i] ?? null, 2, i + 1);
    }

    for (let i = 0; i < 4; i++) {
      createMatch(qf[i] ?? null, 3, i + 1);
    }

    for (let i = 0; i < 2; i++) {
      createMatch(sf[i] ?? null, 4, i + 1);
    }

    createMatch(final ?? null, 5, 1);
    const connectRounds = (fromRound: number, toRound: number) => {
      const previous = matches.filter((m) => m.round_id === fromRound);
      const next = matches.filter((m) => m.round_id === toRound);

      next.forEach((match, index) => {
        match.opponent1 = {
          ...match.opponent1,
          source: previous[index * 2].id,
        };

        match.opponent2 = {
          ...match.opponent2,
          source: previous[index * 2 + 1].id,
        };
      });
    };
    const matchIdMap = new Map<string, number>();

    r32.forEach((m, i) => {
      matchIdMap.set(m.id, i + 1);
    });

    // connectRounds(1, 2);
    // connectRounds(2, 3);
    // connectRounds(3, 4);
    // connectRounds(4, 5);

    return {
      stages: [
        {
          id: 1,
          tournament_id: 1,
          name: 'World Cup',
          type: 'single_elimination',
          number: 1,

          settings: {
            size: 32,
            skipFirstRound: false,
            grandFinal: false,
            consolationFinal: false,
          },
        },
      ],

      groups: [
        {
          id: 1,
          stage_id: 1,
          number: 1,
          size: 32,
        },
      ],

      rounds: [
        {
          id: 1,
          stage_id: 1,
          group_id: 1,
          number: 1,
          name: 'Round of 32',
        },
        {
          id: 2,
          stage_id: 1,
          group_id: 1,
          number: 2,
          name: 'Round of 16',
        },
        {
          id: 3,
          stage_id: 1,
          group_id: 1,
          number: 3,
          name: 'Quarter Finals',
        },
        {
          id: 4,
          stage_id: 1,
          group_id: 1,
          number: 4,
          name: 'Semi Finals',
        },
        {
          id: 5,
          stage_id: 1,
          group_id: 1,
          number: 5,
          name: 'Final',
        },
      ],

      participants,
      matches,
      matchGames: [],
    };
  }
}
